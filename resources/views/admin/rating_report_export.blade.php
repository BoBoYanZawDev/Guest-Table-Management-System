<table>
    <thead>
        <tr>
            <th>No</th>
            <th>Date</th>
            <th>User</th>
            <th>Branch</th>
            <th>Department</th>
            <th>Category</th>
            <th>Subcategory</th>
            <th>Rating</th>
            <th>Feedback</th>
        </tr>
    </thead>
    <tbody>
        @forelse($ratings as $record)
        <tr>
            <td>{{ $loop->index + 1 }}</td>
            <td>{{ $record->created_at }}</td>
            <td>{{ $record->user_name }}</td>
            <td>{{ $record->branch_name }}</td>
            <td>{{ $record->dept_name }}</td>
            <td>{{ $record->cat_name }}</td>
            <td>{{ $record->subcat_name }}</td>
            <td>{{ $record->title }}</td>
            <td>{{ $record->feedback_msg }}</td>
        </tr>
        @empty
        <tr>
            <td colspan="9" class="text-center">No Data</td>
        </tr>
        @endforelse
    </tbody>
</table>