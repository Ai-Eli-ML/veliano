import { Suspense } from "react"
import { PageHeading } from "@/components/ui/page-heading"
import { Skeleton } from "@/components/ui/skeleton"
import VerifyContent from "@/components/verify/verify-content"

export default function VerifyPage() {
  return (
    <div className="container max-w-md py-12">
      <PageHeading 
        title="Email Verification" 
        description="Verify your email address"
        className="text-center"
      />
      
      <Suspense fallback={<VerifySkeleton />}>
        <VerifyContent />
      </Suspense>
    </div>
  )
}

function VerifySkeleton() {
  return (
    <div className="mt-6 border rounded-lg shadow-sm">
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
        </div>
        <div className="flex flex-col items-center p-6">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="mt-4 h-4 w-1/3 mx-auto" />
        </div>
        <div className="flex justify-center gap-4">
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </div>
  )
}
