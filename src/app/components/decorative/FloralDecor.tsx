export function FloralCornerTopLeft({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 0C20 20 40 30 60 35C50 45 45 60 45 75C45 95 60 110 80 110C95 110 110 100 115 85C120 95 135 100 150 95C170 88 180 65 175 45C170 25 150 10 130 10C115 10 105 20 100 35C95 20 85 10 70 5C50 0 25 0 0 0Z"
        fill="currentColor"
        opacity="0.12"
      />
      <circle cx="80" cy="75" r="8" fill="currentColor" opacity="0.15" />
      <circle cx="60" cy="50" r="6" fill="currentColor" opacity="0.12" />
      <circle cx="100" cy="55" r="5" fill="currentColor" opacity="0.1" />
    </svg>
  );
}

export function FloralCornerTopRight({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M200 0C180 20 160 30 140 35C150 45 155 60 155 75C155 95 140 110 120 110C105 110 90 100 85 85C80 95 65 100 50 95C30 88 20 65 25 45C30 25 50 10 70 10C85 10 95 20 100 35C105 20 115 10 130 5C150 0 175 0 200 0Z"
        fill="currentColor"
        opacity="0.12"
      />
      <circle cx="120" cy="75" r="8" fill="currentColor" opacity="0.15" />
      <circle cx="140" cy="50" r="6" fill="currentColor" opacity="0.12" />
      <circle cx="100" cy="55" r="5" fill="currentColor" opacity="0.1" />
    </svg>
  );
}

export function FloralDivider({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Center mandala */}
      <circle cx="200" cy="40" r="25" stroke="currentColor" strokeWidth="1.5" opacity="0.2" />
      <circle cx="200" cy="40" r="18" stroke="currentColor" strokeWidth="1" opacity="0.25" />
      <circle cx="200" cy="40" r="12" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <path
        d="M200 28L204 36L212 36L206 42L208 50L200 45L192 50L194 42L188 36L196 36L200 28Z"
        fill="currentColor"
        opacity="0.25"
      />
      
      {/* Left flourish */}
      <path
        d="M120 40C120 35 125 30 130 30C135 30 140 35 140 40C140 45 135 50 130 50C125 50 120 45 120 40Z"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M100 40Q110 35 120 40T140 40"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.2"
      />
      
      {/* Right flourish */}
      <path
        d="M280 40C280 35 275 30 270 30C265 30 260 35 260 40C260 45 265 50 270 50C275 50 280 45 280 40Z"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M300 40Q290 35 280 40T260 40"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.2"
      />
      
      {/* Decorative dots */}
      <circle cx="160" cy="40" r="3" fill="currentColor" opacity="0.2" />
      <circle cx="240" cy="40" r="3" fill="currentColor" opacity="0.2" />
      <circle cx="175" cy="35" r="2" fill="currentColor" opacity="0.15" />
      <circle cx="225" cy="35" r="2" fill="currentColor" opacity="0.15" />
    </svg>
  );
}

export function MandalaDecor({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="1" opacity="0.08" />
      <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="1.5" opacity="0.1" />
      <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="1" opacity="0.12" />
      <circle cx="100" cy="100" r="30" stroke="currentColor" strokeWidth="1" opacity="0.15" />
      
      {/* Petals */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 100 + Math.cos(rad) * 30;
        const y1 = 100 + Math.sin(rad) * 30;
        const x2 = 100 + Math.cos(rad) * 70;
        const y2 = 100 + Math.sin(rad) * 70;
        return (
          <g key={i}>
            <ellipse
              cx={(x1 + x2) / 2}
              cy={(y1 + y2) / 2}
              rx="8"
              ry="20"
              transform={`rotate(${angle} ${(x1 + x2) / 2} ${(y1 + y2) / 2})`}
              fill="currentColor"
              opacity="0.08"
            />
          </g>
        );
      })}
      
      <circle cx="100" cy="100" r="10" fill="currentColor" opacity="0.15" />
    </svg>
  );
}

export function LotusDecor({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Lotus petals */}
      <path
        d="M100 120C95 100 85 85 70 80C85 75 95 60 100 40C105 60 115 75 130 80C115 85 105 100 100 120Z"
        fill="currentColor"
        opacity="0.12"
      />
      <path
        d="M100 120C90 105 75 95 60 95C75 90 90 75 100 60C110 75 125 90 140 95C125 95 110 105 100 120Z"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M100 120C85 110 65 105 50 110C65 100 85 85 100 70C115 85 135 100 150 110C135 105 115 110 100 120Z"
        fill="currentColor"
        opacity="0.1"
      />
      <circle cx="100" cy="100" r="8" fill="currentColor" opacity="0.2" />
    </svg>
  );
}

export function PaisleyDecor({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M50 10C30 10 15 25 15 50C15 75 25 95 40 110C45 115 50 120 55 130C60 120 65 115 70 110C85 95 95 75 95 50C95 25 80 10 60 10C58 10 50 10 50 10Z"
        fill="currentColor"
        opacity="0.1"
      />
      <path
        d="M50 30C40 30 30 40 30 55C30 70 38 82 48 90C50 92 52 95 54 100C56 95 58 92 60 90C70 82 78 70 78 55C78 40 68 30 58 30C56 30 50 30 50 30Z"
        fill="currentColor"
        opacity="0.15"
      />
      <circle cx="50" cy="60" r="8" fill="currentColor" opacity="0.12" />
      <circle cx="50" cy="45" r="5" fill="currentColor" opacity="0.1" />
    </svg>
  );
}

export function JasmineDecor({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Jasmine flowers in a cluster */}
      {/* Main flower */}
      <g transform="translate(100, 80)">
        {/* 5 petals in a star pattern */}
        {[0, 72, 144, 216, 288].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x = Math.cos(rad) * 20;
          const y = Math.sin(rad) * 20;
          return (
            <ellipse
              key={i}
              cx={x}
              cy={y}
              rx="12"
              ry="8"
              transform={`rotate(${angle} ${x} ${y})`}
              fill="currentColor"
              opacity="0.15"
            />
          );
        })}
        <circle cx="0" cy="0" r="6" fill="currentColor" opacity="0.2" />
      </g>

      {/* Secondary flower top-left */}
      <g transform="translate(60, 50)">
        {[0, 72, 144, 216, 288].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x = Math.cos(rad) * 15;
          const y = Math.sin(rad) * 15;
          return (
            <ellipse
              key={i}
              cx={x}
              cy={y}
              rx="9"
              ry="6"
              transform={`rotate(${angle} ${x} ${y})`}
              fill="currentColor"
              opacity="0.12"
            />
          );
        })}
        <circle cx="0" cy="0" r="4" fill="currentColor" opacity="0.18" />
      </g>

      {/* Secondary flower top-right */}
      <g transform="translate(140, 50)">
        {[0, 72, 144, 216, 288].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x = Math.cos(rad) * 15;
          const y = Math.sin(rad) * 15;
          return (
            <ellipse
              key={i}
              cx={x}
              cy={y}
              rx="9"
              ry="6"
              transform={`rotate(${angle} ${x} ${y})`}
              fill="currentColor"
              opacity="0.12"
            />
          );
        })}
        <circle cx="0" cy="0" r="4" fill="currentColor" opacity="0.18" />
      </g>

      {/* Small buds */}
      <circle cx="80" cy="100" r="5" fill="currentColor" opacity="0.1" />
      <circle cx="120" cy="100" r="5" fill="currentColor" opacity="0.1" />
      <circle cx="100" cy="120" r="4" fill="currentColor" opacity="0.08" />

      {/* Stems */}
      <path
        d="M100 80Q95 100 80 100"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.1"
      />
      <path
        d="M100 80Q105 100 120 100"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.1"
      />
      <path
        d="M100 80L100 120"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.1"
      />
    </svg>
  );
}
