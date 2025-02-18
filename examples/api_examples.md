<!-- # API Usage Examples

## Python (using requests)
```python
import requests

def get_student_checklist(roll_number, branch):
    url = f"http://localhost:3002/api/checklist-data/{roll_number}/{branch}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        return f"Error: {response.status_code}"

# Example usage
data = get_student_checklist("2021001", "CSE")
print(data)
```

## JavaScript (using fetch)
```javascript
async function getStudentChecklist(rollNumber, branch) {
    try {
        const response = await fetch(`http://localhost:3002/api/checklist-data/${rollNumber}/${branch}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

// Example usage
getStudentChecklist("2021001", "CSE")
    .then(data => console.log(data));
```

## cURL (Command Line)
```bash
curl http://localhost:3002/api/checklist-data/2021001/CSE
```

## Java (using HttpClient)
```java
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;

public class ChecklistClient {
    public static String getStudentChecklist(String rollNumber, String branch) {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("http://localhost:3002/api/checklist-data/" + rollNumber + "/" + branch))
            .build();

        try {
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            return response.body();
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

    public static void main(String[] args) {
        String data = getStudentChecklist("2021001", "CSE");
        System.out.println(data);
    }
}
```

## PHP
```php
<?php
function getStudentChecklist($rollNumber, $branch) {
    $url = "http://localhost:3002/api/checklist-data/{$rollNumber}/{$branch}";
    $response = file_get_contents($url);
    return json_decode($response, true);
}

// Example usage
$data = getStudentChecklist("2021001", "CSE");
print_r($data);
?>
```

The API will return a JSON response containing:
- dataSourceTwo: Array of all requirement rules
- courseData: Map of all course details
- completedBuckets: Array of bucket completion status
- bucketCredits: Total bucket credits
- bucketStatus: Overall bucket status

Note: Replace `http://localhost:3002` with your actual server URL in production. -->
