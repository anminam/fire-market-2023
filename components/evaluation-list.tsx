import Star from './star';

interface Props {
  list: Item[];
}
interface Item {
  name: string;
  star: number;
  comment: string;
}

export default function EvaluationList({ list }: Props) {
  return (
    <ul>
      {list.map((item, i) => (
        <li key={i} className="py-4 border-b divide-[hsl(var(--bc)/20%)]">
          <div className="">
            <div className="flex space-x-4 items-center">
              <div className="w-12 h-12 rounded-full bg-slate-500" />
              <div>
                <h4 className="text-sm font-bold text-gray-800">{item.name}</h4>
                <Star count={item.star} />
              </div>
            </div>
            <div className="mt-4 text-gray-600 text-sm">
              <p>{item.comment}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
