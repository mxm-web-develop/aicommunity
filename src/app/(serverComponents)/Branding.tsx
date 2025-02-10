import AdBillboardCarousel from '@/components/AdBillboardCarousel'
import React from 'react'

export const revalidate = 3600
async function Branding({ data }: any) {
  // const brandingData = await readJSONFile('web/home.json')
  // const brands = brandingData['brands']
  // const vedios = brandingData['vedios']
  // console.log('Branding Data:', JSON.stringify(brandingData, null, 2))

  return (
    <div className=' bg-theme-black relative  w-full  mx-auto'>
      <div className='w-full lg:w-10/12 mx-auto'>
        <AdBillboardCarousel ads={data} />

      </div>

    </div>
  )
}

export default Branding