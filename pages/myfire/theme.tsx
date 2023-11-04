import Layout from '@/components/layout';
import { useMiniStore } from '@/hooks/useStore';
import { ITheme } from '@/interface/Theme';

interface ThemeItem {
  key: ITheme;
  label: string;
}
const list: ThemeItem[] = [
  {
    key: 'light',
    label: '밝은',
  },
  {
    key: 'dark',
    label: '다크',
  },
  {
    key: 'retro',
    label: '레트로',
  },
  {
    key: 'valentine',
    label: '핑쿠',
  },
  {
    key: 'cyberpunk',
    label: '싸이버펑크',
  },
  {
    key: 'cupcake',
    label: '컵케익',
  },
];
export default function Theme() {
  const { setTheme } = useMiniStore();

  return (
    <Layout title="테마" canGoBack>
      <div className="flex flex-col">
        {list.map((item) => (
          <button key={item.key} className="" onClick={() => setTheme(item.key)}>
            <div
              className="border-base-content/20 hover:border-base-content/40 overflow-hidden rounded-lg border outline outline-2 outline-offset-2 outline-transparent"
              data-set-theme={item.key}
              // data-act-className="!outline-base-content"
            >
              <div data-theme={item.key} className="bg-base-100 text-base-content w-full cursor-pointer font-sans">
                <div className="grid grid-cols-5 grid-rows-3">
                  <div className="bg-base-200 col-start-1 row-span-2 row-start-1"></div>{' '}
                  <div className="bg-base-300 col-start-1 row-start-3"></div>{' '}
                  <div className="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2">
                    <div className="flex font-bold">{item.label}</div>{' '}
                    <div className="flex flex-wrap gap-1" data-svelte-h="svelte-1kw79c2">
                      <div className="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                        <div className="text-primary-content text-sm font-bold">A</div>
                      </div>{' '}
                      <div className="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                        <div className="text-secondary-content text-sm font-bold">A</div>
                      </div>{' '}
                      <div className="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                        <div className="text-accent-content text-sm font-bold">A</div>
                      </div>{' '}
                      <div className="bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                        <div className="text-neutral-content text-sm font-bold">A</div>
                      </div>{' '}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </Layout>
  );
}
