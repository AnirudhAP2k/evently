import { auth } from '@/auth';
import OrganizationForm from '@/components/shared/OrganizationForm'
import React from 'react'

const page = async () => {
  const session = await auth();

  const userId = session?.user.id as string;
  
  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">Create Organizations</h3>
      </section>

      <div className="wrapper my-8">
        <OrganizationForm userId={userId} type="Create" />
      </div>
    </>
  )
}

export default page
