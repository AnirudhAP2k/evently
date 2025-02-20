import VerificationForm from '@/components/auth/VerificationForm'
import SkeletonCard from '@/components/SkeletonCard'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <Suspense fallback={ <SkeletonCard /> }>
      <div>
        <VerificationForm />
      </div>
    </Suspense>
  )
}

export default page
