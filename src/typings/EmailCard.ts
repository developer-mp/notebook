export interface IEmailCard {
  defaultTitle?: string;
  defaultContent?: string;
  recipientEmail: string;
  onSubmit: ({
    title,
    content,
    recipientEmail,
  }: {
    title: string;
    content: string;
    recipientEmail: string;
  }) => void;
}
