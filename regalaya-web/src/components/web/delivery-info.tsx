import { Truck, Package, Store, Clock, ShieldCheck } from "lucide-react"

interface DeliveryInfoProps {
  stock?: number
}

export function DeliveryInfo({ stock = 0 }: DeliveryInfoProps) {
  const deliveryOptions = [
    {
      icon: Truck,
      title: "Frete Grátis",
      description: "Para pedidos acima de R$ 199",
      highlight: true,
    },
    {
      icon: Package,
      title: "Embalagem Presente",
      description: "Papel de seda e laço incluso",
      highlight: false,
    },
    {
      icon: Store,
      title: "Retiro em Loja",
      description: "Rua Example, 123 - Centro",
      highlight: false,
    },
  ]

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
        Informações de Entrega
      </h3>

      <div className="space-y-3">
        {deliveryOptions.map((option, index) => (
          <div key={index} className="flex items-start gap-3">
            <div
              className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                option.highlight
                  ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                  : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              }`}
            >
              <option.icon className="h-4 w-4" />
            </div>
            <div>
              <p
                className={`text-sm font-medium ${
                  option.highlight
                    ? "text-amber-700 dark:text-amber-300"
                    : "text-zinc-700 dark:text-zinc-300"
                }`}
              >
                {option.title}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {option.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 pt-2 text-xs text-zinc-500 dark:text-zinc-400">
        <Clock className="h-3.5 w-3.5" />
        <span>
          {stock > 10
            ? "Envio em até 24h úteis"
            : stock > 0
            ? `Apenas ${stock} unidades em estoque - Envio imediato`
            : "Produto indisponível"}
        </span>
      </div>

      <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <ShieldCheck className="h-3.5 w-3.5" />
        <span>Compra segura com entrega rastreada</span>
      </div>
    </div>
  )
}
