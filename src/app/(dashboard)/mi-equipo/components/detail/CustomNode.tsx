
type Props = {
    data: {
        label: string;
        initials: string;
        email: string;
        referralCode: string;
        position: string;
        isActive: boolean;
        isCurrent: boolean;
        depth: number;
        membership?: {
            plan?: { name: string };
            status?: string;
        };
        rank?: string;
    };
}

const CustomNode = ({ data }: Props) => {
    return (
        <div
            className={`p-3 rounded-lg border-2 text-center shadow-sm max-w-[180px] w-full ${data.isCurrent
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-muted/50"
                } ${!data.isActive ? "opacity-70" : ""}`}
            style={{ backdropFilter: "blur(4px)" }}
        >
            <div className="flex flex-col items-center gap-2">
                <div
                    className={`rounded-full overflow-hidden flex items-center justify-center h-10 w-10 bg-gradient-to-br from-muted to-muted/50 ${data.isCurrent ? "ring-2 ring-primary ring-offset-1" : ""
                        }`}
                >
                    <div className="text-xl font-medium">{data.initials}</div>
                </div>

                <div className="space-y-1">
                    <p className="font-medium truncate">{data.label}</p>
                    <div className="flex items-center justify-center gap-1">
                        <div
                            className={`w-2 h-2 rounded-full ${data.isActive ? "bg-green-500" : "bg-red-500"
                                }`}
                        ></div>
                        <span
                            className={`text-xs ${data.isActive ? "text-green-600" : "text-red-600"
                                }`}
                        >
                            {data.isActive ? "Activo" : "Inactivo"}
                        </span>
                    </div>

                    {data.membership && (
                        <div className="mt-1">
                            <span
                                className={`text-[10px] px-2 py-0.5 rounded-full ${data.membership.status === "ACTIVE"
                                    ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                                    : data.membership.status === "PENDING"
                                        ? "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300"
                                        : "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                                    }`}
                            >
                                {data.membership.plan?.name || data.membership.status}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CustomNode