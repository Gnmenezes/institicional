import VideoForm from "@/components/admin/VideoForm";

export default function NovoVideoPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy">Novo vídeo</h1>
      <div className="mt-6">
        <VideoForm />
      </div>
    </div>
  );
}
