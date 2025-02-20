import SetNewPasswordForm from '@/components/auth/SetNewPasswordForm'
import SkeletonCard from '@/components/SkeletonCard'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <Suspense fallback={<SkeletonCard />}>
      <div>
        <SetNewPasswordForm />
      </div>
    </Suspense>
  )
}

export default page
