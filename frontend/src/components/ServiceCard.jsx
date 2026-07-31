export default function ServiceCard({ service }) {
  return (
    <div className="rounded-xl border border-neutral-200 p-6 text-left hover:shadow-md transition-shadow bg-white">
      <div className="text-3xl mb-3">{service.icon}</div>
      <h3 className="font-semibold text-lg mb-1 text-neutral-900">{service.title}</h3>
      <p className="text-sm text-neutral-600">{service.description}</p>
    </div>
  )
}
