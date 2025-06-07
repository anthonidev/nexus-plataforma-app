import { Handle, Position } from "@xyflow/react";

const rankColorMap = {
    BRONZE: { bg: "#CD7F32", text: "#FFF", gradient: "from-amber-600 to-amber-800" },
    EXECUTIVE: { bg: "#1E293B", text: "#FFF", gradient: "from-slate-700 to-slate-900" },
    SILVER: { bg: "#C0C0C0", text: "#FFF", gradient: "from-gray-300 to-gray-400" },
    GOLD: { bg: "#FFD700", text: "#FFF", gradient: "from-yellow-400 to-yellow-600" },
    PLATINUM: { bg: "#E5E4E2", text: "#FFF", gradient: "from-gray-200 to-gray-300" },
    SAPPHIRE: { bg: "#0F52BA", text: "#FFF", gradient: "from-blue-600 to-blue-800" },
    RUBY: { bg: "#E0115F", text: "#FFF", gradient: "from-red-600 to-red-800" },
    DIAMOND: { bg: "#B9F2FF", text: "#FFF", gradient: "from-cyan-200 to-cyan-400" },
    PRESIDENT_DIAMOND: { bg: "#185ADB", text: "#FFF", gradient: "from-blue-700 to-blue-900" },
    CROWNED_DIAMOND: { bg: "#7D3C98", text: "#FFF", gradient: "from-purple-700 to-purple-900" },
};

const membershipColorMap = {
    Ejecutivo: { bg: "#1E293B", text: "#FFF", gradient: "from-slate-700 to-slate-900" },
    VIP: { bg: "#7D3C98", text: "#FFF", gradient: "from-purple-700 to-purple-900" },
    Premium: { bg: "#185ADB", text: "#FFF", gradient: "from-blue-700 to-blue-900" },
};

const membershipStatusMap = {
    ACTIVE: { label: "Activa", class: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
    PENDING: { label: "Pendiente", class: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" },
    INACTIVE: { label: "Inactiva", class: "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300" },
    EXPIRED: { label: "Expirada", class: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
};

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
        rank?: {
            currentRank?: {
                name: string;
                code: string;
            };
            highestRank?: {
                name: string;
                code: string;
            };
        };
    };
}

const CustomNode = ({ data }: Props) => {
    const rankCode = data.rank?.currentRank?.code || "";
    const rankColors = rankColorMap[rankCode as keyof typeof rankColorMap] || { bg: "#64748B", text: "#FFF", gradient: "from-slate-500 to-slate-600" };

    const membershipName = data.membership?.plan?.name || "";
    const membershipColors = membershipColorMap[membershipName as keyof typeof membershipColorMap] || { bg: "#64748B", text: "#FFF", gradient: "from-slate-500 to-slate-600" };

    const membershipStatus = data.membership?.status || "";
    const statusStyle = membershipStatusMap[membershipStatus as keyof typeof membershipStatusMap]?.class || "bg-gray-100 text-gray-800";

    const hasRank = !!data.rank?.currentRank;
    const hasMembership = !!data.membership?.plan;

    const colorStyle = hasRank ? rankColors : hasMembership ? membershipColors : { bg: "#64748B", text: "#FFF", gradient: "from-slate-500 to-slate-600" };

    return (
        <div
            className={`relative rounded-lg border shadow-md transition-all duration-300 
        w-[200px] h-[160px] ${data.isCurrent ? "scale-105" : ""} 
        ${data.isActive ? "opacity-100" : "opacity-70"}`}
            style={{ backdropFilter: "blur(8px)" }}
        >
            <div className={`h-2 w-full rounded-t-lg bg-gradient-to-r ${colorStyle.gradient}`}></div>

            <div className="p-3 pb-3 bg-background dark:bg-card rounded-b-lg border-t-0 border-x border-b relative h-[158px]">
                <Handle type="target" position={Position.Top} className="w-3 h-3 -top-1.5" />

                {hasRank && (
                    <div
                        className="absolute top-1 left-1 text-[10px] px-1.5 py-0.5 rounded-md flex items-center gap-1 w-fit"
                        style={{ backgroundColor: rankColors.bg + "33", }}
                    >
                        <span className="truncate max-w-[90px]">{data?.rank?.currentRank?.name}</span>
                    </div>
                )}
                <div className="flex flex-col items-center gap-2 mt-3">
                    <div
                        className={`rounded-full flex items-center justify-center h-12 w-12 text-lg font-semibold bg-gradient-to-br ${colorStyle.gradient} text-white 
              ${data.isCurrent ? "ring-2 ring-primary ring-offset-2 dark:ring-offset-gray-800" : ""}`}
                    >
                        {data.initials}
                    </div>
                    <div className="text-center flex-col flex items-center">
                        <p className="font-medium truncate text-sm">{data.label}</p>
                        {hasMembership && (
                            <p className={`text-[10px] px-1.5 py-0.5 rounded-md ${statusStyle} flex items-center gap-1 w-fit`}>
                                <span className="truncate max-w-[90px]">{membershipName}</span>
                            </p>
                        )}
                    </div>
                </div>


            </div>

            <Handle type="source" position={Position.Bottom} className="w-3 h-3 -bottom-1.5" />

            {data.isCurrent && (
                <div className="absolute -inset-1 rounded-lg bg-primary/10 -z-10 animate-pulse"></div>
            )}
        </div>
    );
}

export default CustomNode;