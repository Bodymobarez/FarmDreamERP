import { FilterBar } from '../FilterBar'

export default function FilterBarExample() {
  return (
    <div className="p-8 bg-background">
      <FilterBar
        searchPlaceholder="ابحث عن حيوان برقم الأذن..."
        showPenFilter
        showBatchFilter
        showStatusFilter
        onSearchChange={(value) => console.log('Search:', value)}
        onPenChange={(value) => console.log('Pen:', value)}
        onBatchChange={(value) => console.log('Batch:', value)}
        onStatusChange={(value) => console.log('Status:', value)}
      />
    </div>
  )
}
