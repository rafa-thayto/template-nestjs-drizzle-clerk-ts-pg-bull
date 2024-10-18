export const confirmationCodeTemplate = ({
  name,
  confirmationCode,
}: {
  name: string;
  confirmationCode: string;
}) => `
<div>
  <h1>Hey, ${name}!</h1>
  <p>Here is your confirmation code: ${confirmationCode}</p>
</div>
`;
