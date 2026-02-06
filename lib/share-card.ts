export interface ShareCardOptions {
  type: 'test_result' | 'progress_overview';
  score?: number;
  total?: number;
  passed?: boolean;
  questionsStudied?: number;
  accuracy?: number;
  streak?: number;
  locale: 'vi' | 'en';
}

const LABELS = {
  vi: {
    branding: 'congdan.us',
    subtitle: 'Luyện Thi Quốc Tịch Mỹ',
    testResult: 'Ket Qua Bai Thi',
    progressOverview: 'Tien Do Hoc Tap',
    passed: 'DAU',
    failed: 'CHUA DAU',
    questionsStudied: 'Cau Da Hoc',
    accuracy: 'Do Chinh Xac',
    streak: 'Chuoi Ngay',
    footer: 'Hoc cung toi tai congdan.us',
    of: '/',
  },
  en: {
    branding: 'congdan.us',
    subtitle: 'U.S. Citizenship Test Prep',
    testResult: 'Test Result',
    progressOverview: 'Study Progress',
    passed: 'PASSED',
    failed: 'NOT YET',
    questionsStudied: 'Questions Studied',
    accuracy: 'Accuracy',
    streak: 'Day Streak',
    footer: 'Study with me at congdan.us',
    of: '/',
  },
};

export async function generateShareCard(options: ShareCardOptions): Promise<Blob> {
  const { type, score, total, passed, questionsStudied, accuracy, streak, locale } = options;
  const labels = LABELS[locale];

  const WIDTH = 1200;
  const HEIGHT = 630;
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 2;

  const canvas = document.createElement('canvas');
  canvas.width = WIDTH * dpr;
  canvas.height = HEIGHT * dpr;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  ctx.scale(dpr, dpr);

  // Determine color scheme
  const isPositive = type === 'test_result' ? passed : true;

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  if (isPositive) {
    gradient.addColorStop(0, '#065f46');
    gradient.addColorStop(0.5, '#047857');
    gradient.addColorStop(1, '#0d9488');
  } else {
    gradient.addColorStop(0, '#991b1b');
    gradient.addColorStop(0.5, '#dc2626');
    gradient.addColorStop(1, '#ef4444');
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Subtle pattern overlay
  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
  for (let i = 0; i < WIDTH; i += 40) {
    for (let j = 0; j < HEIGHT; j += 40) {
      if ((i + j) % 80 === 0) {
        ctx.fillRect(i, j, 20, 20);
      }
    }
  }

  // Top section: Branding
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.font = 'bold 42px Inter, system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(labels.branding, 60, 70);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = '22px Inter, system-ui, sans-serif';
  ctx.fillText(labels.subtitle, 60, 105);

  // Badge (type label)
  const badgeText = type === 'test_result' ? labels.testResult : labels.progressOverview;
  ctx.font = 'bold 16px Inter, system-ui, sans-serif';
  const badgeWidth = ctx.measureText(badgeText).width + 32;
  const badgeX = WIDTH - 60 - badgeWidth;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  roundRect(ctx, badgeX, 50, badgeWidth, 36, 18);
  ctx.fill();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.textAlign = 'center';
  ctx.fillText(badgeText, badgeX + badgeWidth / 2, 74);

  // Center section: Score circle
  const centerX = WIDTH / 2;
  const centerY = 300;
  const circleRadius = 110;

  // Circle background
  ctx.beginPath();
  ctx.arc(centerX, centerY, circleRadius + 8, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(centerX, centerY, circleRadius, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.fill();

  // Progress arc
  if (type === 'test_result' && score !== undefined && total !== undefined) {
    const pct = score / total;
    ctx.beginPath();
    ctx.arc(centerX, centerY, circleRadius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * pct);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Score text
    const percentage = Math.round(pct * 100);
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = 'bold 72px Inter, system-ui, sans-serif';
    ctx.fillText(`${percentage}%`, centerX, centerY + 10);

    ctx.font = '24px Inter, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText(`${score}${labels.of}${total}`, centerX, centerY + 45);
  } else if (type === 'progress_overview' && questionsStudied !== undefined) {
    const pct = Math.min(questionsStudied / 128, 1);
    ctx.beginPath();
    ctx.arc(centerX, centerY, circleRadius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * pct);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = 'bold 64px Inter, system-ui, sans-serif';
    ctx.fillText(`${questionsStudied}`, centerX, centerY + 5);

    ctx.font = '22px Inter, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText(`${labels.of}128`, centerX, centerY + 40);
  }

  // Pass/Fail badge below circle (for test results)
  if (type === 'test_result' && passed !== undefined) {
    const statusText = passed ? labels.passed : labels.failed;
    const statusEmoji = passed ? '  ' : '  ';
    ctx.font = 'bold 20px Inter, system-ui, sans-serif';
    const statusWidth = ctx.measureText(statusEmoji + statusText).width + 40;
    ctx.fillStyle = passed ? 'rgba(134, 239, 172, 0.3)' : 'rgba(252, 165, 165, 0.3)';
    roundRect(ctx, centerX - statusWidth / 2, centerY + 65, statusWidth, 40, 20);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(statusEmoji + statusText, centerX, centerY + 91);
  }

  // Stats row
  const statsY = 480;
  const stats: Array<{ emoji: string; label: string; value: string }> = [];

  if (questionsStudied !== undefined) {
    stats.push({
      emoji: '📖',
      label: labels.questionsStudied,
      value: `${questionsStudied}/128`,
    });
  }
  if (accuracy !== undefined) {
    stats.push({
      emoji: '🎯',
      label: labels.accuracy,
      value: `${accuracy}%`,
    });
  }
  if (streak !== undefined && streak > 0) {
    stats.push({
      emoji: '🔥',
      label: labels.streak,
      value: `${streak}`,
    });
  }

  if (stats.length > 0) {
    const statWidth = Math.min(260, (WIDTH - 120) / stats.length);
    const totalWidth = statWidth * stats.length;
    const startX = (WIDTH - totalWidth) / 2;

    stats.forEach((stat, i) => {
      const x = startX + statWidth * i + statWidth / 2;

      // Stat card background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      roundRect(ctx, x - statWidth / 2 + 10, statsY - 30, statWidth - 20, 80, 12);
      ctx.fill();

      ctx.textAlign = 'center';

      // Emoji + value
      ctx.font = 'bold 28px Inter, system-ui, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`${stat.emoji} ${stat.value}`, x, statsY + 8);

      // Label
      ctx.font = '14px Inter, system-ui, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText(stat.label, x, statsY + 35);
    });
  }

  // Footer
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.fillRect(0, HEIGHT - 60, WIDTH, 60);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.font = '18px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(labels.footer, WIDTH / 2, HEIGHT - 25);

  // US flag emoji on the right
  ctx.font = '28px Inter, system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('🇺🇸', WIDTH - 40, HEIGHT - 20);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to generate image'));
      },
      'image/png',
      1.0
    );
  });
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
