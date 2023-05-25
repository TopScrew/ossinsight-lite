import { ErrorComponent } from 'next/dist/client/components/error-boundary';
import { PropsWithChildren } from 'react';

export const SimpleErrorComponent = ({ error }: { error: any }) => {
  return <span className='text-red-600 font-bold inline-block rounded px-2 py-0.5 bg-red-200'>{String(error?.message ?? error)}</span>
}

function ErrorBoundary ({ children }: PropsWithChildren) {

}
