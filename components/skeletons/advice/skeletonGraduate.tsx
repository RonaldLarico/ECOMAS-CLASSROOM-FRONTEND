
import { Skeleton, SVGSkeleton } from "@/components/skeletons/Skeleton";

export const AdviceGraduateSkeleton = () => (
  <>
    <div className="px-4 py-6">
      <div className="flex items-center justify-between mb-2">
        <h2>
          <Skeleton className="w-[48px] max-w-full" />
        </h2>
        <div className="inline-flex items-center justify-center transition-colors h-9 px-3">
          <Skeleton className="w-[152px] max-w-full" />
        </div>
      </div>
      <div>
        <div className="inline-flex h-10 items-center justify-center p-1">
          <div className="inline-flex items-center justify-center px-3 py-1.5 border">
            <Skeleton className="w-[160px] max-w-full" />
          </div>
          <div className="inline-flex items-center justify-center px-3 py-1.5 border">
            <Skeleton className="w-[176px] max-w-full" />
          </div>
          <div className="inline-flex items-center justify-center px-3 py-1.5 border">
            <Skeleton className="w-[176px] max-w-full" />
          </div>
          <div className="inline-flex items-center justify-center px-3 py-1.5 border">
            <Skeleton className="w-[96px] max-w-full" />
          </div>
          <div className="inline-flex items-center justify-center px-3 py-1.5 border">
            <Skeleton className="w-[112px] max-w-full" />
          </div>
        </div>
        <div className="mt-2">
          <div className="mt-4">
            <div className="flex gap-4">
              <div className="grid w-full items-center gap-1.5">
                <label className="leading-none">
                  <Skeleton className="w-[104px] max-w-full" />
                </label>
                <div className="flex h-10 w-full border border-input px-3 py-2 file:border-0"></div>
              </div>
              <div className="grid w-full items-center gap-1.5">
                <label className="leading-none">
                  <Skeleton className="w-[144px] max-w-full" />
                </label>
                <div className="flex h-10 w-full border border-input px-3 py-2 file:border-0"></div>
              </div>
              <div className="grid w-full items-center gap-1.5">
                <label className="leading-none">
                  <Skeleton className="w-[72px] max-w-full" />
                </label>
                <div className="flex h-10 w-full border border-input px-3 py-2 file:border-0"></div>
              </div>
              <div className="grid w-full items-center gap-1.5">
                <label className="leading-none">
                  <Skeleton className="w-[48px] max-w-full" />
                </label>
                <div className="flex h-10 w-full border border-input px-3 py-2 file:border-0"></div>
              </div>
            </div>
            <div className="flex gap-4 mt-2">
              <div className="grid w-full items-center gap-1.5">
                <label className="leading-none">
                  <Skeleton className="w-[72px] max-w-full" />
                </label>
                <div className="flex h-10 w-full border border-input px-3 py-2 file:border-0"></div>
              </div>
              <div className="grid w-full items-center gap-1.5">
                <label className="leading-none">
                  <Skeleton className="w-[152px] max-w-full" />
                </label>
                <div className="flex h-10 w-full border border-input px-3 py-2 file:border-0"></div>
              </div>
              <div className="grid w-full items-center gap-1.5">
                <label className="leading-none">
                  <Skeleton className="w-[72px] max-w-full" />
                </label>
                <div className="flex h-10 w-full border border-input px-3 py-2 file:border-0"></div>
              </div>
            </div>
            <div className="flex gap-4 mt-2">
              <div className="relative grid w-full items-center gap-1.5">
                <label className="leading-none">
                  <Skeleton className="w-[64px] max-w-full" />
                </label>
                <div className="relative">
                  <div className="flex h-10 w-full border border-input px-3 py-2 file:border-0 pr-10"></div>
                  <div className="inline-flex items-center justify-center transition-colors absolute right-0 top-1/2 -translate-y-1/2 size-7 mx-2">
                    <SVGSkeleton className="w-[24px] h-[24px]" />
                  </div>
                </div>
              </div>
              <div className="grid w-full items-center gap-1.5">
                <label className="leading-none">
                  <Skeleton className="w-[136px] max-w-full" />
                </label>
                <div className="relative">
                  <div className="flex h-10 w-full border border-input px-3 py-2 file:border-0 pr-10"></div>
                  <div className="inline-flex items-center justify-center transition-colors absolute right-0 top-1/2 -translate-y-1/2 size-7 mx-2">
                    <SVGSkeleton className="w-[24px] h-[24px]" />
                  </div>
                </div>
              </div>
              <div className="grid w-full items-center gap-1.5">
                <label className="leading-none">
                  <Skeleton className="w-[168px] max-w-full" />
                </label>
                <div className="relative">
                  <div className="flex h-10 w-full border border-input px-3 py-2 file:border-0 pr-10"></div>
                  <div className="inline-flex items-center justify-center transition-colors absolute right-0 top-1/2 -translate-y-1/2 size-7 mx-2">
                    <SVGSkeleton className="w-[24px] h-[24px]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-2"></div>
      </div>
    </div>
  </>
);
