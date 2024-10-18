export const customEmailTemplate = ({
  subject,
  body,
}: {
  subject: string;
  body: string;
}) => `
<div>
  <h1>${subject}</h1>
  <p>${body.replace(/\n/g, '<br />')}</p>
</div>
`;
