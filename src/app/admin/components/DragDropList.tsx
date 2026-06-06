import { useRef, ReactNode } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { GripVertical } from 'lucide-react';

interface DragItem {
  index: number;
  type: string;
}

interface DraggableRowProps {
  index: number;
  id: string;
  type?: string;
  onMove: (from: number, to: number) => void;
  children: ReactNode;
  className?: string;
}

export function DraggableRow({
  index,
  id,
  type = 'ROW',
  onMove,
  children,
  className = '',
}: DraggableRowProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isOver, dropPosition }, drop] = useDrop<DragItem, void, { isOver: boolean; dropPosition: 'top' | 'bottom' | null }>({
    accept: type,
    collect(monitor) {
      if (!monitor.isOver()) return { isOver: false, dropPosition: null };
      const clientOffset = monitor.getClientOffset();
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      if (!clientOffset || !hoverBoundingRect) return { isOver: true, dropPosition: null };
      const midY = (hoverBoundingRect.top + hoverBoundingRect.bottom) / 2;
      return { isOver: true, dropPosition: clientOffset.y < midY ? 'top' : 'bottom' };
    },
    hover(item, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
      onMove(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag<DragItem, void, { isDragging: boolean }>({
    type,
    item: { index, type },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  preview(drop(ref));

  return (
    <div
      ref={ref}
      className={`relative transition-all duration-150 ${isDragging ? 'opacity-40 scale-[0.98]' : 'opacity-100'} ${
        isOver && dropPosition === 'top' ? 'border-t-2 border-[#8B4949]' : ''
      } ${isOver && dropPosition === 'bottom' ? 'border-b-2 border-[#8B4949]' : ''} ${className}`}
    >
      <div className="flex items-start gap-2">
        <div
          ref={drag}
          className="drag-handle mt-3 flex-shrink-0 cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-[#8B4949] transition-colors"
          title="Drag to reorder"
        >
          <GripVertical size={16} />
        </div>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}

interface DragDropListProps<T extends { id: string }> {
  items: T[];
  onReorder: (items: T[]) => void;
  renderItem: (item: T, index: number) => ReactNode;
  type?: string;
  className?: string;
  itemClassName?: string;
}

export function DragDropList<T extends { id: string }>({
  items,
  onReorder,
  renderItem,
  type = 'ITEM',
  className = '',
  itemClassName = '',
}: DragDropListProps<T>) {
  const moveItem = (from: number, to: number) => {
    const updated = [...items];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    onReorder(updated);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item, index) => (
        <DraggableRow
          key={item.id}
          index={index}
          id={item.id}
          type={type}
          onMove={moveItem}
          className={itemClassName}
        >
          {renderItem(item, index)}
        </DraggableRow>
      ))}
    </div>
  );
}
