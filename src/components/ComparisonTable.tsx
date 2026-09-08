import React from 'react';
import { Check, X, Sparkles, ShieldCheck } from 'lucide-react';

export const ComparisonTable: React.FC = () => {
  const comparisonRows = [
    {
      feature: 'Hold Longevity & Security',
      bodybond: '12+ Hours (Activated by body heat)',
      fashionTape: '1-2 Hours (Loses stick fast)',
      boobTape: 'Variable (Often slips at corners)',
    },
    {
      feature: 'Sweat & Dance Resistance',
      bodybond: '100% Sweat & Humidity Proof',
      fashionTape: 'Falls off at first drop of sweat',
      boobTape: 'Leaves gummy sweat ring',
    },
    {
      feature: 'Removal Experience',
      bodybond: 'Painless glide off with warm water',
      fashionTape: 'Painful pulling on sensitive skin',
      boobTape: 'Rips off skin & ruins spray tan',
    },
    {
      feature: 'Garment & Fabric Safety',
      bodybond: '100% Stain-free & Machine Washable',
      fashionTape: 'Leaves sticky glue lint on silk',
      boobTape: 'Ruins delicate silks and satins',
    },
    {
      feature: 'Skin Nourishing Ingredients',
      bodybond: 'Infused with Aloe, Hyaluronic Acid & B5',
      fashionTape: 'Industrial synthetic resin',
      boobTape: 'Harsh adhesives prone to blisters',
    },
    {
      feature: 'Cost Per Wear & Uses',
      bodybond: '50+ applications per tube (~$0.79/wear)',
      fashionTape: 'Single use strips (Expensive)',
      boobTape: 'Single use roll (Runs out in 3 outfits)',
    },
    {
      feature: 'Invisible on Deep Plunges & Slits',
      bodybond: 'Completely clear liquid micro-bond',
      fashionTape: 'Visible thick white tape edges',
      boobTape: 'Visible ridges under light fabric',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3EDE6] text-xs font-bold text-[#E27D60] tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Bodybond Difference</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl text-[#1A1817] font-normal">
            Why Fashion Tape <span className="italic">Belongs in the Past</span>
          </h2>
          <p className="text-base text-[#6B635C]">
            See why over 10,000+ women switched from painful rolls of boob tape and peeling double-sided strips to Bodybond pro-grade adhesive.
          </p>
        </div>

        {/* Comparison Table Container */}
        <div className="overflow-x-auto rounded-3xl border border-[#E2DAD0] bg-white shadow-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E8E1D9]">
                <th className="p-5 sm:p-6 text-sm font-bold text-[#1A1817] bg-[#FAF7F2] w-1/3">
                  Feature / Performance
                </th>
                <th className="p-5 sm:p-6 text-sm font-extrabold text-[#FAF7F2] bg-[#1A1817] w-1/4 rounded-t-2xl relative">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-brand tracking-wider">BODYBOND</span>
                    <span className="px-2 py-0.5 text-[9px] bg-[#E27D60] text-white rounded-full font-bold">WINNER</span>
                  </div>
                </th>
                <th className="p-5 sm:p-6 text-xs sm:text-sm font-semibold text-[#7A7169] bg-[#F9F6F2] w-1/5">
                  Double-Sided Tape
                </th>
                <th className="p-5 sm:p-6 text-xs sm:text-sm font-semibold text-[#7A7169] bg-[#F9F6F2] w-1/5">
                  Standard Boob Tape
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE9E2] text-xs sm:text-sm">
              {comparisonRows.map((row, index) => (
                <tr key={index} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="p-5 sm:p-6 font-semibold text-[#2E2A27]">
                    {row.feature}
                  </td>
                  <td className="p-5 sm:p-6 font-bold text-[#1A1817] bg-[#F9F6F2]/80 border-x border-[#E8E1D9]">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>{row.bodybond}</span>
                    </div>
                  </td>
                  <td className="p-5 sm:p-6 text-[#7A7169]">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center text-red-500 flex-shrink-0">
                        <X className="w-3 h-3" />
                      </div>
                      <span>{row.fashionTape}</span>
                    </div>
                  </td>
                  <td className="p-5 sm:p-6 text-[#7A7169]">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0">
                        <X className="w-3 h-3" />
                      </div>
                      <span>{row.boobTape}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Guarantee Seal */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left text-xs text-[#6B635C] bg-[#F4EFEB] p-4 rounded-2xl border border-[#E2DAD0]">
          <ShieldCheck className="w-5 h-5 text-[#E27D60]" />
          <span>
            <strong>30-Day Happiness Guarantee:</strong> If Bodybond doesn’t keep your outfit 100% secure, let us know for a hassle-free resolution.
          </span>
        </div>

      </div>
    </section>
  );
};
