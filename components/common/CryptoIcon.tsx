import React, { useState } from "react";

interface CryptoIconProps {
  symbol: string;
  id?: string;
  className?: string;
}

const CryptoIcon: React.FC<CryptoIconProps> = ({
  symbol,
  id,
  className = "w-10 h-10",
}) => {
  const [imageError, setImageError] = useState(false);

  const normalizedSymbol = symbol?.toLowerCase() || "";
  const normalizedId = id?.toLowerCase() || "";

  // Get icon key
  const getIconKey = (val: string): string | null => {
    if (val.includes("bitcoin") || val === "btc") return "btc";
    if (val.includes("ethereum") || val === "eth") return "eth";
    if (val.includes("binance") || val === "bnb") return "bnb";
    if (val.includes("cardano") || val === "ada") return "ada";
    if (val.includes("solana") || val === "sol") return "sol";
    if (val.includes("polkadot") || val === "dot") return "dot";
    return null;
  };

  const iconKey =
    getIconKey(normalizedSymbol) || getIconKey(normalizedId) || "default";

  // CDN icon URLs
  const iconMap: Record<string, string> = {
    btc: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    eth: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    bnb: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    ada: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    sol: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    dot: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png",
  };

  const cdnUrl = iconMap[iconKey];

  // SVG fallback
  const getSVGIcon = () => {
    const svgIcons: Record<string, React.ReactElement> = {
      btc: (
        <svg viewBox="0 0 24 24" className={className}>
          <circle cx="12" cy="12" r="12" fill="#F7931A" />
          <text
            x="12"
            y="16"
            textAnchor="middle"
            fill="white"
            fontSize="10"
            fontWeight="bold"
          >
            ₿
          </text>
        </svg>
      ),
      eth: (
        <svg viewBox="0 0 24 24" className={className}>
          <circle cx="12" cy="12" r="12" fill="#627EEA" />
          <text
            x="12"
            y="16"
            textAnchor="middle"
            fill="white"
            fontSize="10"
            fontWeight="bold"
          >
            Ξ
          </text>
        </svg>
      ),
      bnb: (
        <svg viewBox="0 0 24 24" className={className}>
          <circle cx="12" cy="12" r="12" fill="#F3BA2F" />
          <text
            x="12"
            y="16"
            textAnchor="middle"
            fill="white"
            fontSize="7"
            fontWeight="bold"
          >
            BNB
          </text>
        </svg>
      ),
      ada: (
        <svg viewBox="0 0 24 24" className={className}>
          <circle cx="12" cy="12" r="12" fill="#0033AD" />
          <text
            x="12"
            y="16"
            textAnchor="middle"
            fill="white"
            fontSize="7"
            fontWeight="bold"
          >
            ADA
          </text>
        </svg>
      ),
      sol: (
        <svg viewBox="0 0 24 24" className={className}>
          <defs>
            <linearGradient id="solGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9945FF" />
              <stop offset="100%" stopColor="#14F195" />
            </linearGradient>
          </defs>
          <circle cx="12" cy="12" r="12" fill="url(#solGrad)" />
          <text
            x="12"
            y="16"
            textAnchor="middle"
            fill="white"
            fontSize="7"
            fontWeight="bold"
          >
            SOL
          </text>
        </svg>
      ),
      dot: (
        <svg viewBox="0 0 24 24" className={className}>
          <circle cx="12" cy="12" r="12" fill="#E6007A" />
          <circle cx="8" cy="12" r="1.5" fill="white" />
          <circle cx="12" cy="12" r="1.5" fill="white" />
          <circle cx="16" cy="12" r="1.5" fill="white" />
        </svg>
      ),
    };

    return (
      svgIcons[iconKey] || (
        <svg viewBox="0 0 24 24" className={className}>
          <circle cx="12" cy="12" r="12" fill="#6B7280" />
          <text
            x="12"
            y="16"
            textAnchor="middle"
            fill="white"
            fontSize="7"
            fontWeight="bold"
          >
            {normalizedSymbol.slice(0, 3).toUpperCase() || "?"}
          </text>
        </svg>
      )
    );
  };

  if (cdnUrl && !imageError) {
    return (
      <img
        src={cdnUrl}
        alt={symbol}
        className={`${className} rounded-full object-cover`}
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <div className="flex items-center justify-center rounded-full overflow-hidden">
      {getSVGIcon()}
    </div>
  );
};

export default CryptoIcon;
