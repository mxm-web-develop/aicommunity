import ApplicationList from '@/components/lists/ApplicationList';
import ApplicationForm from '@/components/forms/ApplicationForm';

export const dynamic = 'force-dynamic';

export default async function ApplicationsPage() {

  return (
    <div className="w-full flex justify-center items-start">
      <div className="list w-1/2 p-5">
        <h2 className="text-xl font-bold mb-4">应用列表</h2>
        <ApplicationList  />
      </div>

      <div className="form w-1/2 p-5">
        <h2 className="text-xl font-bold mb-4">添加应用</h2>
        <ApplicationForm />
      </div>
    </div>
  );
}