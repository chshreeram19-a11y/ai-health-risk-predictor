export default function SDGBadges() {
  return (
    <div className="flex flex-wrap gap-3 justify-center py-2">
      <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5">
        <img
          src="/assets/generated/sdg3-badge-transparent.dim_120x120.png"
          alt="SDG 3"
          className="w-9 h-9 object-contain"
        />
        <div>
          <p className="text-xs font-bold text-emerald-800">SDG 3</p>
          <p className="text-xs text-emerald-700">
            Good Health &amp; Well-Being
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2.5 bg-orange-50 border border-orange-200 rounded-xl px-4 py-2.5">
        <img
          src="/assets/generated/sdg9-badge-transparent.dim_120x120.png"
          alt="SDG 9"
          className="w-9 h-9 object-contain"
        />
        <div>
          <p className="text-xs font-bold text-orange-800">SDG 9</p>
          <p className="text-xs text-orange-700">
            Industry, Innovation &amp; Infrastructure
          </p>
        </div>
      </div>
    </div>
  );
}
