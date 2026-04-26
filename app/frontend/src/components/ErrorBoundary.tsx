import { Component, type ReactNode } from 'react';

interface IProps {
  children: ReactNode;
}

interface IState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): IState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className='flex flex-col items-center justify-center min-h-screen gap-4 px-4 text-center'>
          <p className='text-4xl'>😿</p>
          <h1 className='text-xl font-bold'>오류가 발생했습니다</h1>
          <p className='text-sm text-muted-foreground'>
            일시적인 문제가 발생했어요. 페이지를 새로고침해 주세요.
          </p>
          <button
            onClick={this.handleReload}
            className='mt-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity'
          >
            새로고침
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
