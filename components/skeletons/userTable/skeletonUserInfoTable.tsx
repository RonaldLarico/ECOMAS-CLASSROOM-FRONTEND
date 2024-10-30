
import { Skeleton, SVGSkeleton } from "@/components/skeletons/Skeleton";
import React from "react";
export const UserInfoTableSkeleton = () => (
  <>
    <div className="px-4 py-2 pt-7">
      <div className="flex items-center justify-between mb-2">
        <h2>
          <Skeleton className="w-[200px] max-w-full" />
        </h2>
      </div>
      <div>
        <div className="inline-flex h-auto items-center justify-start p-1 flex-wrap">
          <div className="inline-flex items-center justify-center px-2 py-1 flex-grow sm:flex-grow-0 border">
            <Skeleton className="w-[160px] max-w-full" />
          </div>
          <div className="inline-flex items-center justify-center px-2 py-1 flex-grow sm:flex-grow-0 border">
            <Skeleton className="w-[88px] max-w-full" />
          </div>
        </div>
        <div className="mt-2">
          <div className="space-y-2">
            <h3 className="mb-2">
              <Skeleton className="w-[160px] max-w-full" />
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div className="grid w-full items-center gap-1.5">
                <label className="leading-none">
                  <Skeleton className="w-[152px] max-w-full" />
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
                  <Skeleton className="w-[136px] max-w-full" />
                </label>
                <div className="flex h-10 w-full border border-input px-3 py-2 file:border-0"></div>
              </div>
              <div className="grid w-full items-center gap-1.5">
                <label className="leading-none">
                  <Skeleton className="w-[152px] max-w-full" />
                </label>
                <div className="flex h-10 w-full border border-input px-3 py-2 file:border-0"></div>
              </div>
            </div>
            <h3 className="mb-4">
              <Skeleton className="w-[176px] max-w-full" />
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              <div className="grid w-full items-center gap-1.5">
                <label className="leading-none">
                  <Skeleton className="w-[40px] max-w-full" />
                </label>
                <div className="flex h-10 w-full border border-input px-3 py-2 file:border-0"></div>
              </div>
              <div className="grid w-full items-center gap-1.5">
                <label className="leading-none">
                  <Skeleton className="w-[128px] max-w-full" />
                </label>
                <div className="flex h-10 w-full border border-input px-3 py-2 file:border-0"></div>
              </div>
              <div className="grid w-full items-center gap-1.5">
                <label className="leading-none">
                  <Skeleton className="w-[80px] max-w-full" />
                </label>
                <div className="flex h-10 w-full border border-input px-3 py-2 file:border-0"></div>
              </div>
              <div className="grid w-full items-center gap-1.5">
                <label className="leading-none">
                  <Skeleton className="w-[120px] max-w-full" />
                </label>
                <div className="flex h-10 w-full border border-input px-3 py-2 file:border-0"></div>
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                <label className="leading-none">
                  <Skeleton className="w-[136px] max-w-full" />
                </label>
                <div className="flex items-center space-x-2 mb-1">
                  <div className="inline-flex h-6 w-11 shrink-0 items-center border-2 border-transparent transition-colors">
                    <span className="block h-5 w-5 shadow-lg"></span>
                  </div>
                  <label className="leading-none">
                    <Skeleton className="w-[48px] max-w-full" />
                  </label>
                </div>
              </div>
            </div>
            <div className="grid w-full items-center gap-1.5">
              <label className="leading-none">
                <Skeleton className="w-[104px] max-w-full" />
              </label>
              <div className="flex w-full border border-input px-3 py-2">
                <Skeleton className="w-[376px] max-w-full" />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-2"></div>
      </div>
    </div>
  </>
);
