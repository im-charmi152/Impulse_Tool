import { Server } from "lucide-react";
import SectionCard from "../common/SectionCard";
import Badge from "../common/Badge";
import { MQ_QUEUES } from "../../data/mockData";

const COLUMNS = ["Queue Name", "Status", "Messages", "Last Updated"];

export default function MQQueueStatus() {
  return (
    <SectionCard
      icon={Server}
      title="MQ Queue Status"
      actions={
        <button className="text-[10px] text-blue-600 hover:underline">
          View All Queues
        </button>
      }
    >
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-gray-100">
            {COLUMNS.map((h) => (
              <th
                key={h}
                className="text-left pb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wide"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MQ_QUEUES.map((q, i) => (
            <tr
              key={i}
              className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50"
            >
              <td className="py-1.5 font-medium text-gray-700 text-[11px]">
                {q.name}
              </td>
              <td className="py-1.5">
                <Badge color="green">{q.status}</Badge>
              </td>
              <td className="py-1.5 text-gray-500 text-center">{q.messages}</td>
              <td className="py-1.5 text-gray-400 text-[10px]">{q.updated}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="mt-3 text-xs text-blue-600 hover:underline font-medium block text-center w-full">
        View Queue Dashboard
      </button>
    </SectionCard>
  );
}
