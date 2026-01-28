export default function StateCard({
    title,
    value,
    icon,
    bg = "bg-white",
    text = "text-gray-800",
}){
    return (
        <div className={`rounded-xl p-4 items-center shadow-md flex align-center justify-between ${bg}`}>
            <div>
                <p className="text-sm opacity-80">{title}</p>
                <p className={`text-2xl font-bold ${text}`}>{value}</p>
            </div>
            <div className={`text-4xl opacity-90`}>
                {icon}
            </div>
        </div>
    )
}