import { NextRequest, NextResponse } from 'next/server';

type RouteHandlerParams = {
  params: { [key: string]: string };
};

export const apiHandler = (
  handler: (req: NextRequest, context?: RouteHandlerParams) => Promise<any>
) => {
  return async (req: NextRequest, context?: RouteHandlerParams) => {
    try {
      const result = await handler(req, context);
      return NextResponse.json({ success: true, ...result });
    } catch (error: any) {
      console.error(error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.cause?.status || 500 }
      );
    }
  };
}; 