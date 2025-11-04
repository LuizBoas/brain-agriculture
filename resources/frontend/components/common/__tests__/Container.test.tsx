import { render, screen } from '@testing-library/react';
import { Container } from '../container';

describe('Container Component', () => {
    it('renders children content', () => {
        render(
            <Container>
                <div>Test Content</div>
            </Container>
        );
        expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        const { container } = render(
            <Container className="custom-class">
                <div>Content</div>
            </Container>
        );
        expect(container.firstChild).toHaveClass('custom-class');
    });
});

