export function Panel({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      data-panel
      data-panel-id={id}
      data-panel-title={title}
      className="h-screen w-full flex-shrink-0 snap-start"
    >
      <div className="h-full w-full max-w-[1100px] mx-auto px-10 py-24 flex flex-col justify-center">
        {children}
      </div>
    </section>
  );
}
