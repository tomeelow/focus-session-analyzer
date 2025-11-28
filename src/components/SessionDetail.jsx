import { Button } from './Button';
import { SessionSummary } from './SessionSummary';

// Reuse SessionSummary for now as it has the timeline and details
export function SessionDetail({ session, onClose }) {
    return (
        <div className="animate-in slide-in-from-right-4 duration-500">
            <div className="mb-4">
                <Button variant="ghost" onClick={onClose} className="pl-0 hover:bg-transparent hover:text-gray-600">
                    ← Back to History
                </Button>
            </div>
            <SessionSummary session={session} onClose={onClose} />
        </div>
    );
}
