import { useState, KeyboardEvent } from 'react';
import { X, Plus } from 'lucide-react';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function TagInput({ value, onChange, label, placeholder = 'Type and press Enter...', className = '' }: TagInputProps) {
  const [input, setInput] = useState('');

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput('');
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="admin-label">{label}</label>}
      <div className="min-h-[44px] p-2 bg-[#faf8f5] border-[1.5px] border-[#e5e5e5] rounded-[0.625rem] flex flex-wrap gap-1.5 focus-within:border-[#8B4949] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(139,73,73,0.1)] transition-all">
        {value.map((tag, i) => (
          <span key={i} className="admin-tag">
            {tag}
            <button type="button" onClick={() => removeTag(i)} aria-label={`Remove ${tag}`}>
              <X size={10} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => input.trim() && addTag(input)}
          placeholder={value.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm text-[#4a4a4a] placeholder-gray-400 py-0.5"
        />
      </div>
      <p className="text-xs text-gray-400">Press Enter or comma to add a tag</p>
    </div>
  );
}
