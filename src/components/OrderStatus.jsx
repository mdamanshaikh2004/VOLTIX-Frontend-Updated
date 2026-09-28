export default function OrderStatus({status}){return <span className={`status status-${String(status).toLowerCase().replaceAll(' ','-')}`}>{status}</span>}
