'use server';
import { defaultLayoutConfig } from '@/core/layout/defaults';
import { getDatabaseUri, sql, withConnection } from '@/utils/mysql';
import { ADMIN_DATABASE_NAME } from '@/utils/server/auth';
import { LayoutConfigV1, LibraryItem } from '@/utils/types/config';
import { revalidatePath } from 'next/cache';
import { cache } from 'react';

export async function addLibraryItemAction (item: LibraryItem) {
  await addLibraryItem(item);

  revalidatePath('/admin/widgets');
}

export async function getWidgets () {
  return await sql<LibraryItem>`
      SELECT id, widget_name AS name, properties AS props
      FROM library_items
      WHERE widget_name NOT LIKE 'internal:%'
      ORDER BY widget_name, id
  `;
}

export async function addLibraryItem (item: LibraryItem) {
  await sql`
      INSERT INTO library_items (id, widget_name, properties)
      VALUES (${item.id}, ${item.name}, ${JSON.stringify(item.props)})
  `;
}

export async function uploadLayoutJsonAction (formData: FormData) {
  const config: LayoutConfigV1 = JSON.parse(await (formData.get('layout.json') as File).text());

  if (config.version !== 1) {
    throw new Error('Only support layout.json version 1');
  }

  await withConnection(getDatabaseUri(ADMIN_DATABASE_NAME), async ({ sql, beginTransaction }) => {
    await beginTransaction();
    for (const { id, name, props } of config.library) {
      const propsString = JSON.stringify(props ?? {});
      console.log(`import library item ${id ?? name}`);
      await sql`
          INSERT INTO library_items (id, widget_name, properties)
          VALUES (${id ?? name}, ${name}, ${propsString})
          ON DUPLICATE KEY UPDATE widget_name = ${name},
                                  properties  = ${propsString};
      `;
    }
    for (const [name, { items, ...rest }] of Object.entries(config.dashboard)) {
      console.log(`import dashboard ${name}`);
      const confString = JSON.stringify(rest);
      await sql`
          INSERT INTO dashboards(name, properties)
          VALUES (${name}, ${confString})
          ON DUPLICATE KEY UPDATE properties = ${confString}
      `;

      await sql`
          DELETE
          FROM dashboard_items
          WHERE dashboard_name = ${name}
      `;

      for (const { id, ...rest } of items) {
        const restJson = JSON.stringify(rest);
        console.log(`import dashboard item ${id}`);

        await sql`
            INSERT INTO dashboard_items (dashboard_name, item_id, properties)
            VALUES (${name}, ${id}, ${restJson})
        `;
      }
    }
  });
}

export async function addDashboardAction (formData: FormData) {
  const name = formData.get('name');
  if (typeof name !== 'string') {
    throw new Error('name is required');
  }

  await addDashboard(name);
  revalidatePath('/admin/dashboards');
}

export async function deleteDashboardAction (name: string) {
  if (typeof name !== 'string') {
    throw new Error('name is required');
  }

  await deleteDashboard(name);
  revalidatePath('/admin/dashboards');
}

export async function getDashboards () {
  return await withConnection(getDatabaseUri(ADMIN_DATABASE_NAME), async ({ sql }) => (
    sql<{ name: string }>`
        SELECT name
        FROM dashboards;
    `
  ));
}

export async function addDashboard (name: string) {
  await withConnection(getDatabaseUri(ADMIN_DATABASE_NAME), async ({ sql }) => (
    sql`
        INSERT INTO dashboards (name, properties)
        VALUES (${name}, ${JSON.stringify({ layout: defaultLayoutConfig })})
    `
  ));
}

export async function deleteDashboard (name: string) {
  if (name === 'default') {
    throw new Error(`Do not delete dashboard ${name}`);
  }

  await withConnection(getDatabaseUri(ADMIN_DATABASE_NAME), async ({ sql }) => (
    sql`
        DELETE
        FROM dashboards
        WHERE name = ${name}
    `
  ));
}


export const findItem = cache(async function findItem (id: string) {
  return await sql.unique<{ id: string, name: string, props: any }>`
      SELECT properties AS props, widget_name AS name, id
      FROM library_items
      WHERE id = ${id}
  `;
});
