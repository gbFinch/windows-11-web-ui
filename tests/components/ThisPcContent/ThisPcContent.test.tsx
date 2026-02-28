// ThisPcContent component tests — covers FR-16, FR-17, FR-18, FR-19
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ThisPcContent from '../../../src/components/ThisPcContent/ThisPcContent';

describe('ThisPcContent', () => {
  // TC-U-08 | Covers: FR-16, AC-10
  it('renders breadcrumb with "This PC" text', () => {
    render(<ThisPcContent />);
    expect(screen.getByText('This PC')).toBeInTheDocument();
  });

  // TC-U-09 | Covers: FR-17, AC-10
  it('renders sidebar with four quick-access items', () => {
    render(<ThisPcContent />);
    expect(screen.getByText('Desktop')).toBeInTheDocument();
    expect(screen.getByText('Documents')).toBeInTheDocument();
    expect(screen.getByText('Downloads')).toBeInTheDocument();
    expect(screen.getByText('Pictures')).toBeInTheDocument();
  });

  // TC-U-10 | Covers: FR-18, AC-9
  it('renders three drive tiles with correct labels', () => {
    render(<ThisPcContent />);
    expect(screen.getByText('Local Disk (C:)')).toBeInTheDocument();
    expect(screen.getByText('Data (D:)')).toBeInTheDocument();
    expect(screen.getByText('USB Drive (E:)')).toBeInTheDocument();
  });

  // TC-U-11 | Covers: FR-19, AC-9
  it('renders free/total text for each drive', () => {
    render(<ThisPcContent />);
    expect(screen.getByText('120 GB free of 256 GB')).toBeInTheDocument();
    expect(screen.getByText('340 GB free of 512 GB')).toBeInTheDocument();
    expect(screen.getByText('18 GB free of 32 GB')).toBeInTheDocument();
  });

  // TC-NF-03 | Covers: NFR-8
  it('renders usage bar elements for each drive', () => {
    render(<ThisPcContent />);
    expect(screen.getAllByRole('progressbar')).toHaveLength(3);
  });
});
