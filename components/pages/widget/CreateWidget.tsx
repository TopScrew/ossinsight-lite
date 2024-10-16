'use client'
import { ModalContext } from '@/app/@modal/(all)/context';
import EditWidgetInstance from '@/components/EditWidgetInstance';
import { currentDashboard, library } from '@/core/bind';
import { widgets } from '@/core/bind-client';
import RoughBox from '@/packages/ui/components/roughness/shape/box';
import { readItem } from '@/packages/ui/hooks/bind';
import { useCallback, useContext, useState } from 'react';
import colors from 'tailwindcss/colors';

export interface CreateWidgetProps {
  name: string;
}

export default function CreateWidget ({ name }: CreateWidgetProps) {
  const widget = readItem(widgets, name);
  const { closeModal } = useContext(ModalContext);

  const [props, setProps] = useState(() => {
    return { ...widget.current.defaultProps };
  });

  const handlePropsChange = useCallback((key: string, value: any) => {
    setProps(props => ({ ...props, [key]: value }));
  }, []);

  const handleSave = useCallback(() => {
    const id = `${name}-${Date.now()}`;
    library.add(id, {
      id,
      name,
      props,
    });
    if (currentDashboard.current) {
      currentDashboard.current.items.add(id, {
        id,
        rect: widget.current.defaultRect ?? [0, 0, 8, 3],
      });
    }
    closeModal();
  }, []);

  return (
    <div className="h-full flex flex-col justify-stretch">
      <div className="flex items-center justify-end">
        <button className="block relative" onClick={handleSave}>
          <span className="relative z-10 px-4 font-bold inline-flex gap-2 items-center text-blue-700">
            Save
          </span>
          <RoughBox color={colors.blue['400']} />
        </button>
      </div>
      <div className="flex-1 overflow-hidden">
        <EditWidgetInstance
          props={props}
          onPropsChange={handlePropsChange}
          name={name} creating
        />
      </div>
    </div>
  );
}