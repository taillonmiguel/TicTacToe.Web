export function PlayerBadge(props: {
  label: string;
  nickname: string;
  active?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border border-foreground/10 px-3 py-2 text-sm ${
        props.active ? "ring-2 ring-foreground/30" : ""
      }`}
    >
      <div className="text-xs opacity-70">{props.label}</div>
      <div className="font-medium">
        {props.active ? (
          <span className="marcaTexto">{props.nickname}</span>
        ) : (
          props.nickname
        )}
      </div>
    </div>
  );
}
