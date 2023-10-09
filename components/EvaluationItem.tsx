import Star from './star';

interface Props {
  id: number;
  name: string;
  star: number;
  comment: string;
}

export default function EvaluationItem({ id, name, star, comment }: Props) {
  return (
    <li key={id} className="py-4 border-b">
      <div className="">
        <div className="flex space-x-4 items-center">
          <div className="w-12 h-12 rounded-full bg-slate-500" />
          <div>
            <h4 className="text-sm font-bold text-gray-800">{name}</h4>
            <Star count={star} />
          </div>
        </div>
        <div className="mt-4 text-gray-600 text-sm">
          <p>{comment}</p>
        </div>
      </div>
    </li>
  );
}
