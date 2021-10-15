import { Test, TestingModule } from '@nestjs/testing';
import { SnapshotsService } from './snapshots.service';

describe('SnapshotsService', () => {
  let service: SnapshotsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: SnapshotsService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<SnapshotsService>(SnapshotsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
