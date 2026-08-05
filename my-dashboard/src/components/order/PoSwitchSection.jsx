import { SlidersHorizontal } from "lucide-react";
import SectionCard from "../common/SectionCard";
import Badge from "../common/Badge";

const SWITCH_FIELDS = [
  { key: "resvInvSw", label: "Reservation Inventory Switch" },
  { key: "cnsgnSw", label: "Consignment Switch" },
  { key: "shipFlg", label: "Ship Flag" },
  { key: "ordrRejFlg", label: "Order Rejected Flag" },
  { key: "taxFlg", label: "Tax Flag" },
  { key: "isDelvFlg", label: "Delivery Flag" },
  { key: "ordrHasErrs", label: "Order Has Errors" },
];

function resolveSwitchState(value) {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (["y", "1", "true", "yes", "enabled"].includes(normalized)) {
    return { color: "green", text: "Enabled" };
  }
  if (["n", "0", "false", "no", "disabled"].includes(normalized)) {
    return { color: "gray", text: "Disabled" };
  }
  if (!normalized || normalized === "—") {
    return { color: "gray", text: "—" };
  }
  return { color: "amber", text: String(value) };
}

function PoSwitchSection({ order }) {
  return (
    <SectionCard icon={SlidersHorizontal} title="PO Switch">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {SWITCH_FIELDS.map((field) => {
          const state = resolveSwitchState(order?.[field.key]);
          return (
            <div
              key={field.key}
              className="flex items-center justify-between gap-3 rounded-xl border border-[#D6E4F7] bg-[#F8FAFC] px-3 py-2.5"
            >
              <span className="field-label text-xs leading-snug">{field.label}</span>
              <Badge color={state.color}>{state.text}</Badge>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

export default PoSwitchSection;
