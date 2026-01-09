import { Input } from "@/app/components/ui/input"

interface MonthPickerProps {
  value: Date
  onChange: (date: Date) => void
}

export function MonthPicker({ value, onChange }: MonthPickerProps) {
  const formatted = `${value.getFullYear()}-${String(
    value.getMonth() + 1
  ).padStart(2, "0")}`

  return (
    <div className="max-w-xs">
      <Input
        type="month"
        value={formatted}
        onChange={(e) => {
          const [year, month] = e.target.value.split("-")
          onChange(new Date(Number(year), Number(month) - 1))
        }}
      />
    </div>
  )
}
