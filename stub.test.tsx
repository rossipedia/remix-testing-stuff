import { Link, useLoaderData } from '@remix-run/react';
import { createRemixStub } from '@remix-run/testing';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('Stub', async () => {
  const RemixStub = createRemixStub([
    {
      id: 'bar',
      path: '/bar',
      loader: () => ({ message: 'hello, world' }),
      Component: () => {
        const { message } = useLoaderData<{ message: string }>();
        return (
          <div>
            <p>{message}</p>
            <Link to="/foo">Go to foo</Link>
          </div>
        );
      },
    },

    {
      id: 'foo',
      path: '/foo',
      loader: () => ({ message: 'shazbot' }),
      Component: () => {
        const { message } = useLoaderData<{ message: string }>();
        return (
          <div>
            <p>{message}</p>
            <Link to="/bar">Back to bar</Link>
          </div>
        );
      },
    },
  ]);

  render(
    <RemixStub
      initialEntries={['/bar']}
      hydrationData={{
        loaderData: {
          bar: { message: 'hello, world' },
        },
      }}
    />
  );
  const user = userEvent.setup();

  expect(screen.getByText('hello, world')).toBeInTheDocument();
  await user.click(screen.getByText('Go to foo'));
  expect(await screen.findByText('shazbot')).toBeInTheDocument();
  await user.click(screen.getByText('Back to bar'));
  expect(await screen.findByText('hello, world')).toBeInTheDocument();
});
