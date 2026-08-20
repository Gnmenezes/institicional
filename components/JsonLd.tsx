/**
 * Injeta dado estruturado na página.
 *
 * O JSON vai serializado com as barras escapadas para que uma string com
 * "</script>" no meio não feche a tag antes da hora.
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
