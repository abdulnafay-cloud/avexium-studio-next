export async function onRequestError(){if(process.env.NEXT_RUNTIME==='nodejs'){const {operationalEvent}=await import('./lib/operations');await operationalEvent('unhandled_request_failure');}}
