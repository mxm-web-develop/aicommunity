import { NextRequest, NextResponse } from 'next/server';

export const apiHandler = (handler: (req: NextRequest) => Promise<any>) => {
  return async (req: NextRequest) => {
    try {
      const result = await handler(req);
      return NextResponse.json({ success: true, ...result });
    } catch (error: any) {
      console.error(error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.status || 500 }
      );
    }
  };
}; 