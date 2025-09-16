import { NextResponse } from 'next/server'
import { checkAllBlueOceanApps } from '@/lib/blueocean-status'

export async function GET() {
  try {
    const apps = await checkAllBlueOceanApps()
    
    return NextResponse.json({
      success: true,
      data: apps,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error checking BlueOcean status:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to check BlueOcean applications status',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}