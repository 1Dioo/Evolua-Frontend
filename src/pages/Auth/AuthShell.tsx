import type { ReactNode } from "react";

export function AuthShell({
    sideTitle,
    sideDescription,
    sideItems,
    illustration,
    sidePosition,
    children,
}: {
    sideTitle: ReactNode;
    sideDescription: string;
    sideItems: string[];
    illustration: string;
    sidePosition: "left" | "right";
    children: ReactNode;
}) {
    const side = (
        <section
            className={`relative hidden min-h-screen overflow-hidden bg-[#07132f] lg:flex lg:w-1/2 ${
                sidePosition === "left"
                    ? "lg:rounded-r-[72px]"
                    : "lg:rounded-l-[72px]"
            }`}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(119,0,255,.58),transparent_34%),radial-gradient(circle_at_92%_92%,rgba(121,0,255,.62),transparent_38%)]" />

            <div className="absolute inset-0 bg-gradient-to-br from-[#28105f]/75 via-[#07132f]/20 to-[#17083d]/70" />

            <div className="relative z-10 flex min-h-screen w-full flex-col px-10 py-10 xl:px-14">
                <div className="flex flex-1 flex-col justify-center">
                    <h2 className="max-w-[600px] text-4xl font-bold leading-[1.05] tracking-tight text-white xl:text-[54px]">
                        {sideTitle}
                    </h2>

                    <p className="mt-7 max-w-[590px] text-lg leading-relaxed text-white/80">
                        {sideDescription}
                    </p>

                    <ul className="mt-7 space-y-5 text-lg text-white/90">
                        {sideItems.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </div>

                <div className="relative mt-2 flex h-[330px] w-full items-end justify-center xl:h-[380px]">
                    <img
                        src={illustration}
                        alt=""
                        className="auth-illustration absolute bottom-[-20px] left-1/2 w-[min(72%,520px)] max-w-none -translate-x-1/2 object-contain xl:w-[min(70%,580px)]"
                    />
                </div>
            </div>
        </section>
    );

    const form = (
        <section className="flex min-h-screen w-full items-center justify-center overflow-y-auto bg-[#080b11] px-6 py-12 lg:w-1/2 lg:px-12">
            <div className="w-full">{children}</div>
        </section>
    );

    return (
        <main className="min-h-screen bg-[#080b11] text-white">
            <style>{`
                @keyframes authFloat {
                    0%, 100% {
                        transform: translate3d(-50%, 0, 0);
                    }

                    50% {
                        transform: translate3d(-50%, -10px, 0);
                    }
                }

                @keyframes authEnter {
                    from {
                        opacity: 0;
                        transform: translate3d(-50%, 25px, 0) scale(.96);
                    }

                    to {
                        opacity: 1;
                        transform: translate3d(-50%, 0, 0) scale(1);
                    }
                }

                .auth-illustration {
                    animation:
                        authEnter .7s ease-out,
                        authFloat 5s ease-in-out 0.7s infinite;
                    will-change: transform;
                }

                @media (prefers-reduced-motion: reduce) {
                    .auth-illustration {
                        animation: none;
                    }
                }

                @media (max-height: 750px) and (min-width: 1024px) {
                    .auth-illustration {
                        width: min(62%, 440px);
                        bottom: -35px;
                    }
                }
            `}</style>

            <div className="flex min-h-screen w-full">
                {sidePosition === "left" ? (
                    <>
                        {side}
                        {form}
                    </>
                ) : (
                    <>
                        {form}
                        {side}
                    </>
                )}
            </div>
        </main>
    );
}