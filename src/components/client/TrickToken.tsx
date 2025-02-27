'use client'

import { headers } from "next/headers"
import { useEffect, useState } from "react"

export default  function TrickToken() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const host = window.location.host;
      console.log('Current host:', host);
    }
  }, [])
  return (
    <>

    </>
  )
}