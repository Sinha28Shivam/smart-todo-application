export default function StateCard({
    title,
    value,
    icon,
    bg = "bg-white",
    text = "text-gray-800",
    ariaLabel,
}){
    return (
        <div 
            className={`rounded-xl p-4 items-center shadow-md flex align-center justify-between ${bg}`}
            role="region"
            aria-label={ariaLabel || title}
        >
            <div>
                <p className="text-sm opacity-80 font-black">{title}</p>
                <p className={`text-2xl font-bold ${text}`} role="status">
                    {value}
                </p>
            </div>
            <div 
                className={`text-4xl opacity-90`}
                aria-hidden="true"
                role="img"
            >
                {icon}
            </div>
        </div>
    )
}