import ReferencePage from '@/components/ReferencePage';
import {pageMetadata,publicPages} from '@/lib/site-metadata';
export const metadata=pageMetadata('/',...publicPages.home);
export default function Home(){return <ReferencePage section="home"/>;}
