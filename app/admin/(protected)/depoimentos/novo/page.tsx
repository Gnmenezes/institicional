import TestimonialForm from "@/components/admin/TestimonialForm";

export default function NovoDepoimentoPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy">Novo depoimento</h1>
      <div className="mt-6">
        <TestimonialForm />
      </div>
    </div>
  );
}
